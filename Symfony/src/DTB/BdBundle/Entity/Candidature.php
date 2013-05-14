<?php

namespace DTB\BdBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Candidature
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="DTB\BdBundle\Entity\CandidatureRepository")
 */
class Candidature
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
     * @ORM\Column(name="coverLetter", type="text")
     */
    private $coverLetter;
    
    /**
     * @ORM\ManytoOne(targetEntity="DTB\UserBundle\Entity\DTBUser", inversedBy="candidatures")
     */
    private $user;
    
    /**
     * @ORM\ManyToOne(targetEntity="DTB\BdBundle\Entity\BandeDessinee", inversedBy="candidatures")
     */
    private $bd;

    /**
     * @var string
     *
     * @ORM\Column(name="type", type="string", length=255)
     */
    private $type;
    

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
     * Set coverLetter
     *
     * @param string $coverLetter
     * @return Candidature
     */
    public function setCoverLetter($coverLetter)
    {
        $this->coverLetter = $coverLetter;
    
        return $this;
    }

    /**
     * Get coverLetter
     *
     * @return string 
     */
    public function getCoverLetter()
    {
        return $this->coverLetter;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->bd = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Set user
     *
     * @param \DTB\UserBundle\Entity\DTBUser $user
     * @return Candidature
     */
    public function setUser(\DTB\UserBundle\Entity\DTBUser $user = null)
    {
        $this->user = $user;
    
        return $this;
    }

    /**
     * Get user
     *
     * @return \DTB\UserBundle\Entity\DTBUser 
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Get bd
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getBd()
    {
        return $this->bd;
    }

    /**
     * Set type
     *
     * @param string $type
     * @return Candidature
     */
    public function setType($type)
    {
        $this->type = $type;
    
        return $this;
    }

    /**
     * Get type
     *
     * @return string 
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set bd
     *
     * @param \DTB\BdBundle\Entity\BandeDessinee $bd
     * @return Candidature
     */
    public function setBd(\DTB\BdBundle\Entity\BandeDessinee $bd = null)
    {
        $this->bd = $bd;
    
        return $this;
    }
}