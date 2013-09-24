<?php

namespace DTB\BdBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Forum
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="DTB\BdBundle\Entity\ForumRepository")
 */
class Forum
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text")
     */
    private $description;
    
    /**
     * @ORM\ManytoOne(targetEntity="DTB\BdBundle\Entity\BandeDessinee", inversedBy="forums", cascade={"persist"})
     */
    private $bandeDessinee;
    
    /**
     * @ORM\OneToMany(targetEntity="DTB\BdBundle\Entity\Topic", mappedBy="forum")
     */
    private $topics;


    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     * @return Forum
     */
    public function setName($name)
    {
        $this->name = $name;
    
        return $this;
    }

    /**
     * Get name
     *
     * @return string 
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return Forum
     */
    public function setDescription($description)
    {
        $this->description = $description;
    
        return $this;
    }

    /**
     * Get description
     *
     * @return string 
     */
    public function getDescription()
    {
        return $this->description;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->topics = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Set bandeDessinee
     *
     * @param \DTB\BdBundle\Entity\BandeDessinee $bandeDessinee
     * @return Forum
     */
    public function setBandeDessinee(\DTB\BdBundle\Entity\BandeDessinee $bandeDessinee = null)
    {
        $this->bandeDessinee = $bandeDessinee;
    
        return $this;
    }

    /**
     * Get bandeDessinee
     *
     * @return \DTB\BdBundle\Entity\BandeDessinee 
     */
    public function getBandeDessinee()
    {
        return $this->bandeDessinee;
    }

    /**
     * Add topics
     *
     * @param \DTB\BdBundle\Entity\Topic $topics
     * @return Forum
     */
    public function addTopic(\DTB\BdBundle\Entity\Topic $topics)
    {
        $this->topics[] = $topics;
    
        return $this;
    }

    /**
     * Remove topics
     *
     * @param \DTB\BdBundle\Entity\Topic $topics
     */
    public function removeTopic(\DTB\BdBundle\Entity\Topic $topics)
    {
        $this->topics->removeElement($topics);
    }

    /**
     * Get topics
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getTopics()
    {
        return $this->topics;
    }
}