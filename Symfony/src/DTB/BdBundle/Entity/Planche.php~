<?php

namespace DTB\BdBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Planche
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="DTB\BdBundle\Entity\PlancheRepository")
 */
class Planche
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
     * @var integer
     *
     * @ORM\Column(name="page", type="integer", nullable=true)
     */
    private $page;
    
    /**
     * @ORM\ManytoOne(targetEntity="DTB\BdBundle\Entity\BandeDessinee", inversedBy="planches", cascade={"persist"})
     */
    private $bandeDessinee;
    
    /**
     * @ORM\OneToMany(targetEntity="DTB\BdBundle\Entity\Image", mappedBy="planche")
     */
    private $images;


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
     * Set bandeDessinee
     *
     * @param \DTB\BdBundle\Entity\BandeDessinee $bandeDessinee
     * @return Planche
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
     * Constructor
     */
    public function __construct()
    {
        $this->images = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Set page
     *
     * @param integer $page
     * @return Planche
     */
    public function setPage($page)
    {
        $this->page = $page;
    
        return $this;
    }

    /**
     * Get page
     *
     * @return integer 
     */
    public function getPage()
    {
        return $this->page;
    }

    /**
     * Add images
     *
     * @param \DTB\BdBundle\Entity\Image $images
     * @return Planche
     */
    public function addImage(\DTB\BdBundle\Entity\Image $images)
    {
        $this->images[] = $images;
    
        return $this;
    }

    /**
     * Remove images
     *
     * @param \DTB\BdBundle\Entity\Image $images
     */
    public function removeImage(\DTB\BdBundle\Entity\Image $images)
    {
        $this->images->removeElement($images);
    }

    /**
     * Get images
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getImages()
    {
        return $this->images;
    }
}