<?php

namespace DTB\BdBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * BandeDessinee
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="DTB\BdBundle\Entity\BandeDessineeRepository")
 */
class BandeDessinee {

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
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;
    
    /**
     * @var boolean
     *
     * @ORM\Column(name="needDrawers", type="boolean", nullable=true)
     */
    private $needDrawers;
    
    /**
     * @var boolean
     *
     * @ORM\Column(name="needScenarists", type="boolean", nullable=true)
     */
    private $needScenarists;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text")
     */
    private $description;

    /**
     * @ORM\ManytoOne(targetEntity="DTB\BdBundle\Entity\Categorie", inversedBy="bandesDessinees", cascade={"persist"})
     */
    private $category;
    
    /**
     * @ORM\ManytoOne(targetEntity="DTB\UserBundle\Entity\DTBUser", inversedBy="bandesDessineesCreated", cascade={"persist"})
     */
    private $creator;

    /**
     * @ORM\ManyToMany(targetEntity="DTB\BdBundle\Entity\Tag", inversedBy="bandesDessinees", cascade={"persist"})
     */
    private $tags;

    /**
     * @ORM\OneToMany(targetEntity="DTB\BdBundle\Entity\Planche", mappedBy="bandeDessinee")
     */
    private $planches;
    
    /**
     * @ORM\ManytoMany(targetEntity="DTB\UserBundle\Entity\DTBUser", inversedBy="bandesDessineesScenarist", cascade={"persist"})
     * @ORM\JoinTable(name="bds_scenarists")
     */
    private $scenarists;
    
    /**
     * @ORM\ManytoMany(targetEntity="DTB\UserBundle\Entity\DTBUser", inversedBy="bandesDessineesDrawer", cascade={"persist"})
     * @ORM\JoinTable(name="bds_drawers")
     */
    private $drawers;


    /**
     * Get id
     *
     * @return integer 
     */

    public function getId() {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     * @return BandeDessinee
     */
    public function setTitle($title) {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string 
     */
    public function getTitle() {
        return $this->title;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return BandeDessinee
     */
    public function setDescription($description) {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string 
     */
    public function getDescription() {
        return $this->description;
    }

    /**
     * Set category
     *
     * @param \DTB\BdBundle\Entity\Categorie $category
     * @return BandeDessinee
     */
    public function setCategory(\DTB\BdBundle\Entity\Categorie $category = null) {
        $this->category = $category;

        return $this;
    }

    /**
     * Get category
     *
     * @return \DTB\BdBundle\Entity\Categorie 
     */
    public function getCategory() {
        return $this->category;
    }

    /**
     * Constructor
     */
    public function __construct() {
        $this->tags = new \Doctrine\Common\Collections\ArrayCollection();
        $this->drawers = new \Doctrine\Common\Collections\ArrayCollection();
        $this->scenarists = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add tags
     *
     * @param \DTB\BdBundle\Entity\Tag $tags
     * @return BandeDessinee
     */
    public function addTag(\DTB\BdBundle\Entity\Tag $tags) {
        $this->tags[] = $tags;

        return $this;
    }

    /**
     * Remove tags
     *
     * @param \DTB\BdBundle\Entity\Tag $tags
     */
    public function removeTag(\DTB\BdBundle\Entity\Tag $tags) {
        $this->tags->removeElement($tags);
    }

    /**
     * Get tags
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getTags() {
        return $this->tags;
    }

    /**
     * Add planches
     *
     * @param \DTB\BdBundle\Entity\Planche $planches
     * @return BandeDessinee
     */
    public function addPlanche(\DTB\BdBundle\Entity\Planche $planches)
    {
        $this->planches[] = $planches;
    
        return $this;
    }

    /**
     * Remove planches
     *
     * @param \DTB\BdBundle\Entity\Planche $planches
     */
    public function removePlanche(\DTB\BdBundle\Entity\Planche $planches)
    {
        $this->planches->removeElement($planches);
    }

    /**
     * Get planches
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getPlanches()
    {
        return $this->planches;
    }

    /**
     * Set creator
     *
     * @param \DTB\UserBundle\Entity\DTBUser $creator
     * @return BandeDessinee
     */
    public function setCreator(\DTB\UserBundle\Entity\DTBUser $creator = null)
    {
        $this->creator = $creator;
    
        return $this;
    }

    /**
     * Get creator
     *
     * @return \DTB\UserBundle\Entity\DTBUser 
     */
    public function getCreator()
    {
        return $this->creator;
    }

    /**
     * Add scenarists
     *
     * @param \DTB\UserBundle\Entity\DTBUser $scenarists
     * @return BandeDessinee
     */
    public function addScenarist(\DTB\UserBundle\Entity\DTBUser $scenarists)
    {
        $this->scenarists[] = $scenarists;
    
        return $this;
    }

    /**
     * Remove scenarists
     *
     * @param \DTB\UserBundle\Entity\DTBUser $scenarists
     */
    public function removeScenarist(\DTB\UserBundle\Entity\DTBUser $scenarists)
    {
        $this->scenarists->removeElement($scenarists);
    }

    /**
     * Get scenarists
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getScenarists()
    {
        return $this->scenarists;
    }

    /**
     * Add drawers
     *
     * @param \DTB\UserBundle\Entity\DTBUser $drawers
     * @return BandeDessinee
     */
    public function addDrawer(\DTB\UserBundle\Entity\DTBUser $drawers)
    {
        $this->drawers[] = $drawers;
    
        return $this;
    }

    /**
     * Remove drawers
     *
     * @param \DTB\UserBundle\Entity\DTBUser $drawers
     */
    public function removeDrawer(\DTB\UserBundle\Entity\DTBUser $drawers)
    {
        $this->drawers->removeElement($drawers);
    }

    /**
     * Get drawers
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getDrawers()
    {
        return $this->drawers;
    }

    /**
     * Set needDrawers
     *
     * @param boolean $needDrawers
     * @return BandeDessinee
     */
    public function setNeedDrawers($needDrawers)
    {
        $this->needDrawers = $needDrawers;
    
        return $this;
    }

    /**
     * Get needDrawers
     *
     * @return boolean 
     */
    public function getNeedDrawers()
    {
        return $this->needDrawers;
    }

    /**
     * Set needScenarists
     *
     * @param boolean $needScenarists
     * @return BandeDessinee
     */
    public function setNeedScenarists($needScenarists)
    {
        $this->needScenarists = $needScenarists;
    
        return $this;
    }

    /**
     * Get needScenarists
     *
     * @return boolean 
     */
    public function getNeedScenarists()
    {
        return $this->needScenarists;
    }
}